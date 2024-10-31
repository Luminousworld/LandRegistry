# Land Registry Smart Contract System

A transparent and tamper-proof land registry system built on the Stacks blockchain using Clarity smart contracts. This system enables secure property registration, ownership verification, and transfer management with comprehensive historical tracking.

## 🌟 Features

- **Property Registration**
    - Secure property registration with unique identifiers
    - Metadata storage for property details
    - Automated ID generation

- **Ownership Management**
    - Secure property transfers between addresses
    - Real-time ownership verification
    - Active status tracking

- **Transaction History**
    - Complete audit trail of all property transactions
    - Timestamp-based history tracking
    - Detailed transaction metadata

- **Security**
    - Authorization checks for all operations
    - Tamper-proof record keeping
    - Error handling for invalid operations

## 📋 Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) - Clarity development environment
- [Node.js](https://nodejs.org/) (v14 or higher)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/land-registry.git
cd land-registry
```

2. Install dependencies:
```bash
npm install
```

3. Set up Clarinet:
```bash
clarinet setup
```

## 💻 Usage

### Deploying the Contract

```bash
clarinet deploy
```

### Interacting with the Contract

#### Register a New Property
```clarity
(contract-call? .land-registry register-property 
    "https://metadata.example.com/property/123")
```

#### Transfer Property
```clarity
(contract-call? .land-registry transfer-property 
    u1 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7)
```

#### Verify Ownership
```clarity
(contract-call? .land-registry verify-ownership 
    u1 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7)
```

### Running Tests

```bash
npm test
```

## 🏗 Project Structure

```
land-registry/
├── contracts/
│   └── land-registry.clar    # Main contract
├── tests/
│   └── land-registry.test.ts # Test suite
├── .gitignore
├── package.json
├── Clarinet.toml
└── README.md
```

## 📝 Smart Contract Functions

### Public Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `register-property` | Registers a new property | `metadata-url: string` |
| `transfer-property` | Transfers property ownership | `property-id: uint`, `recipient: principal` |
| `verify-ownership` | Verifies property ownership | `property-id: uint`, `owner: principal` |
| `get-property-details` | Retrieves property details | `property-id: uint` |
| `get-property-history` | Gets property transaction history | `property-id: uint` |

### Error Codes

| Code | Description |
|------|-------------|
| `u100` | Not authorized |
| `u101` | Property not found |
| `u102` | Invalid property operation |

## 🔒 Security Considerations

1. **Authorization**
    - Only property owners can initiate transfers
    - All operations require proper authorization

2. **Data Integrity**
    - Immutable transaction history
    - Tamper-proof property records

3. **Error Handling**
    - Comprehensive error checking
    - Clear error messages

## 🧪 Testing

The project includes a comprehensive test suite covering:
- Property registration
- Ownership transfers
- Authorization checks
- Edge cases
- Transaction history

Run tests with:
```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contact

Project Maintainer - [Your Name](mailto:your.email@example.com)

Project Link: [https://github.com/your-username/land-registry](https://github.com/your-username/land-registry)

## 🙏 Acknowledgments

- Stacks Foundation
- Clarity Lang Documentation
- Clarinet Development Team
