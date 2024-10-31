import { describe, it, expect, beforeEach } from 'vitest';
import {
  Client,
  Provider,
  ProviderRegistry,
  Result
} from '@blockstack/clarity';

const CONTRACT_NAME = 'land-registry';

describe('Land Registry Contract Tests', () => {
  let client: Client;
  let provider: Provider;
  
  // Test accounts
  const addresses = {
    deployer: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    owner1: "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
    owner2: "ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC"
  };
  
  beforeEach(async () => {
    provider = await ProviderRegistry.createProvider();
    client = new Client(CONTRACT_NAME, 'land-registry', provider);
    
    // Deploy contract
    await client.deployContract();
  });
  
  describe('Property Registration', () => {
    it('should successfully register a new property', async () => {
      const metadata = "https://example.com/property/1";
      const result = await client.executeMethod(
          'register-property',
          [metadata],
          addresses.owner1
      );
      
      expect(result.success).toBe(true);
      const propertyId = Result.unwrap(result);
      expect(propertyId).toBe(1n);
      
      // Verify property details
      const details = await client.executeQuery(
          'get-property-details',
          [propertyId.toString()]
      );
      const propertyDetails = Result.unwrap(details);
      
      expect(propertyDetails.owner).toBe(addresses.owner1);
      expect(propertyDetails.metadata).toBe(metadata);
      expect(propertyDetails.is_active).toBe(true);
    });
    
    it('should increment property ID for each registration', async () => {
      // Register first property
      const result1 = await client.executeMethod(
          'register-property',
          ["https://example.com/1"],
          addresses.owner1
      );
      
      // Register second property
      const result2 = await client.executeMethod(
          'register-property',
          ["https://example.com/2"],
          addresses.owner1
      );
      
      expect(Result.unwrap(result1)).toBe(1n);
      expect(Result.unwrap(result2)).toBe(2n);
    });
  });
  
  describe('Property Transfer', () => {
    let propertyId: bigint;
    
    beforeEach(async () => {
      // Register a property for transfer tests
      const result = await client.executeMethod(
          'register-property',
          ["https://example.com/transfer-test"],
          addresses.owner1
      );
      propertyId = Result.unwrap(result);
    });
    
    it('should allow owner to transfer property', async () => {
      const result = await client.executeMethod(
          'transfer-property',
          [propertyId.toString(), addresses.owner2],
          addresses.owner1
      );
      
      expect(result.success).toBe(true);
      
      // Verify new ownership
      const details = await client.executeQuery(
          'get-property-details',
          [propertyId.toString()]
      );
      const propertyDetails = Result.unwrap(details);
      expect(propertyDetails.owner).toBe(addresses.owner2);
    });
    
    it('should prevent non-owner from transferring property', async () => {
      const result = await client.executeMethod(
          'transfer-property',
          [propertyId.toString(), addresses.owner2],
          addresses.owner2  // Not the owner
      );
      
      expect(result.success).toBe(false);
      expect(Result.unwrapErr(result)).toBe(100); // ERR-NOT-AUTHORIZED
    });
  });
  
  describe('Ownership Verification', () => {
    let propertyId: bigint;
    
    beforeEach(async () => {
      const result = await client.executeMethod(
          'register-property',
          ["https://example.com/verify-test"],
          addresses.owner1
      );
      propertyId = Result.unwrap(result);
    });
    
    it('should correctly verify true ownership', async () => {
      const result = await client.executeQuery(
          'verify-ownership',
          [propertyId.toString(), addresses.owner1]
      );
      
      expect(Result.unwrap(result)).toBe(true);
    });
    
    it('should correctly verify false ownership', async () => {
      const result = await client.executeQuery(
          'verify-ownership',
          [propertyId.toString(), addresses.owner2]
      );
      
      expect(Result.unwrap(result)).toBe(false);
    });
  });
  
  describe('Property History', () => {
    let propertyId: bigint;
    
    beforeEach(async () => {
      // Register and perform some transfers
      const result = await client.executeMethod(
          'register-property',
          ["https://example.com/history-test"],
          addresses.owner1
      );
      propertyId = Result.unwrap(result);
      
      // Perform a transfer
      await client.executeMethod(
          'transfer-property',
          [propertyId.toString(), addresses.owner2],
          addresses.owner1
      );
    });
    
    it('should maintain accurate history of property transactions', async () => {
      const result = await client.executeQuery(
          'get-property-history',
          [propertyId.toString()]
      );
      
      const history = Result.unwrap(result);
      expect(history.length).toBe(2); // Registration + 1 transfer
      
      // Verify registration entry
      expect(history[0].transaction_type).toBe("REGISTRATION");
      expect(history[0].from).toBe(addresses.owner1);
      expect(history[0].to).toBe(addresses.owner1);
      
      // Verify transfer entry
      expect(history[1].transaction_type).toBe("TRANSFER");
      expect(history[1].from).toBe(addresses.owner1);
      expect(history[1].to).toBe(addresses.owner2);
    });
  });
  
  describe('Edge Cases', () => {
    it('should handle non-existent property IDs', async () => {
      const result = await client.executeQuery(
          'get-property-details',
          ['999'] // Non-existent ID
      );
      
      expect(result.success).toBe(false);
      expect(Result.unwrapErr(result)).toBe(101); // ERR-PROPERTY-NOT-FOUND
    });
    
    it('should handle invalid transfers to same owner', async () => {
      // Register property
      const registerResult = await client.executeMethod(
          'register-property',
          ["https://example.com/same-owner-test"],
          addresses.owner1
      );
      const propertyId = Result.unwrap(registerResult);
      
      // Attempt transfer to same owner
      const transferResult = await client.executeMethod(
          'transfer-property',
          [propertyId.toString(), addresses.owner1],
          addresses.owner1
      );
      
      expect(transferResult.success).toBe(false);
      expect(Result.unwrapErr(transferResult)).toBe(102); // ERR-INVALID-PROPERTY
    });
  });
});
