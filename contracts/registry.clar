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
