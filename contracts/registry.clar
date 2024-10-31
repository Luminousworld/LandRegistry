;; Land Registry Smart Contract
;; Implements property registration, ownership verification, and transfer functionality

;; Data Maps
(define-map properties
    { property-id: uint }
    {
        owner: principal,
        metadata-url: (string-utf8 256),
        registration-date: uint,
        last-transfer-date: uint,
        is-active: bool
    }
)

(define-map property-history
    { property-id: uint, transaction-id: uint }
    {
        from: principal,
        to: principal,
        timestamp: uint,
        transaction-type: (string-utf8 20)
    }
)

;; Data Variables
(define-data-var next-property-id uint u1)
(define-data-var next-transaction-id uint u1)

;; Error constants
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-PROPERTY-NOT-FOUND (err u101))
(define-constant ERR-INVALID-PROPERTY (err u102))

;; Register new property
(define-public (register-property (metadata-url (string-utf8 256)))
    (let
        (
            (property-id (var-get next-property-id))
            (caller tx-sender)
        )
        (map-set properties
            { property-id: property-id }
            {
                owner: caller,
                metadata-url: metadata-url,
                registration-date: block-height,
                last-transfer-date: block-height,
                is-active: true
            }
        )

        ;; Record in history
        (map-set property-history
            { property-id: property-id, transaction-id: (var-get next-transaction-id) }
            {
                from: caller,
                to: caller,
                timestamp: block-height,
                transaction-type: "REGISTRATION"
            }
        )

        ;; Increment IDs
        (var-set next-property-id (+ property-id u1))
        (var-set next-transaction-id (+ (var-get next-transaction-id) u1))
        (ok property-id)
    )
)
