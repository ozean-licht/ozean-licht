# Admin Dashboard Test User Credentials

## Database Configuration
- **Database**: `shared-users-db`
- **Host**: `localhost`
- **Port**: `32771`
- **Connection**: `postgresql://postgres:<password>@localhost:32771/shared-users-db`

## Test Users Created

### 🔐 SUPER ADMIN (Full System Access)
- **Email**: `super@ozean-licht.dev`
- **Password**: `SuperAdmin123!`
- **Role**: `super_admin`
- **Entity Scope**: All entities
- **Permissions**: Full system access
- **Description**: Can manage all aspects of both Kids Ascension and Ozean Licht platforms

---

### 👤 ENTITY ADMINS

#### Kids Ascension Admin
- **Email**: `admin.ka@ozean-licht.dev`
- **Password**: `KidsAdmin123!`
- **Role**: `entity_admin`
- **Entity Scope**: `kids_ascension`
- **Permissions**: Full access to Kids Ascension platform
- **Description**: Can manage all aspects of Kids Ascension (users, content, settings)

#### Ozean Licht Admin
- **Email**: `admin.ol@ozean-licht.dev`
- **Password**: `OzeanAdmin123!`
- **Role**: `entity_admin`
- **Entity Scope**: `ozean_licht`
- **Permissions**: Full access to Ozean Licht platform
- **Description**: Can manage all aspects of Ozean Licht (users, content, settings)

---

### 👁️ VIEWERS (Read-Only Access)

#### All Entities Viewer
- **Email**: `viewer@ozean-licht.dev`
- **Password**: `Viewer123!`
- **Role**: `viewer`
- **Entity Scope**: All entities
- **Permissions**: Read-only access
- **Description**: Can view data from both platforms but cannot make changes

#### Kids Ascension Viewer
- **Email**: `viewer.ka@ozean-licht.dev`
- **Password**: `ViewerKA123!`
- **Role**: `viewer`
- **Entity Scope**: `kids_ascension`
- **Permissions**: Read-only access to Kids Ascension
- **Description**: Can only view Kids Ascension data

---

## Access the Dashboard

1. **Local Access**: http://localhost:3000/dashboard
2. **Through SSH Tunnel**: http://localhost:3003/dashboard (or your configured port)

## Permission Matrix

| Role | Users | Content | Settings | System Config |
|------|-------|---------|----------|---------------|
| **super_admin** | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Full Access |
| **entity_admin** | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ❌ No Access |
| **viewer** | ✅ Read Only | ✅ Read Only | ✅ Read Only | ❌ No Access |

## Notes

- All passwords follow strong password requirements (uppercase, lowercase, numbers, special characters)
- Users are stored in the `shared-users-db` for unified authentication
- Entity scope determines which platform(s) a user can access
- The `admin_users` table links to the `users` table for authentication details
- Passwords are hashed using bcrypt with salt rounds of 10

---

**Created**: November 3, 2024
**Last Updated**: November 3, 2024