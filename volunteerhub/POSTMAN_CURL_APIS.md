# VolunteerHub API cURL Collection

Base URL used below:

```bash
http://localhost:5000
```

Replace placeholders before running:
- `{{JWT_TOKEN}}`
- `{{ORG_ID}}`
- `{{USER_ID}}`

## 1) Health Check

```bash
curl --location "http://localhost:5000/health"
```

## 2) Register User

```bash
curl --location "http://localhost:5000/auth/register" \
--header "Content-Type: application/json" \
--data-raw '{
  "name": "John Manager",
  "email": "john.manager@example.com",
  "password": "Password123!",
  "role": "OrganisationManager"
}'
```

## 3) Login User

```bash
curl --location "http://localhost:5000/auth/login" \
--header "Content-Type: application/json" \
--data-raw '{
  "email": "john.manager@example.com",
  "password": "Password123!"
}'
```

## 4) Create Organization (OrganisationManager only)

```bash
curl --location "http://localhost:5000/auth/organizations" \
--header "Authorization: Bearer {{JWT_TOKEN}}" \
--header "Content-Type: application/json" \
--data-raw '{
  "name": "Helping Hands",
  "description": "Community support initiatives",
  "category": "Community",
  "address": "123 Main Street, Melbourne",
  "contactEmail": "contact@helpinghands.org"
}'
```

## 5) Get Organizations (Authenticated)

```bash
curl --location "http://localhost:5000/auth/organizations" \
--header "Authorization: Bearer {{JWT_TOKEN}}"
```

## 6) Get My Organization (OrganisationManager only)

```bash
curl --location "http://localhost:5000/auth/organizations/me" \
--header "Authorization: Bearer {{JWT_TOKEN}}"
```

## 7) Review Organization (Admin only)

```bash
curl --location --request PATCH "http://localhost:5000/auth/organizations/{{ORG_ID}}/review" \
--header "Authorization: Bearer {{JWT_TOKEN}}" \
--header "Content-Type: application/json" \
--data-raw '{
  "status": "Approved"
}'
```

## 8) Update Organization (OrganisationManager owner only, after approval)

```bash
curl --location --request PUT "http://localhost:5000/auth/organizations/{{ORG_ID}}" \
--header "Authorization: Bearer {{JWT_TOKEN}}" \
--header "Content-Type: application/json" \
--data-raw '{
  "name": "Helping Hands Updated",
  "description": "Updated description",
  "category": "Community",
  "address": "456 Updated Street, Melbourne",
  "contactEmail": "updated@helpinghands.org"
}'
```

## 9) Activate/Deactivate User (Admin only)

```bash
curl --location --request PATCH "http://localhost:5000/auth/users/{{USER_ID}}/active" \
--header "Authorization: Bearer {{JWT_TOKEN}}" \
--header "Content-Type: application/json" \
--data-raw '{
  "isActive": true
}'
```
