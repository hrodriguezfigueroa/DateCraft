import { CollectionConfig } from 'payload/types'
import AccessControl from '../utils/accessControl'

const isAdminDevOrSelf = ({ req: { user } }) => {
  // Scenario #1 - Check if user has the 'admin' role
  if (user && (user.role === 'admin' || user.role === 'dev')) {
      return true;
  }

  // Scenario #2 - Allow only documents with the current user set to the 'createdBy' field
  if (user) {
    // Will return access for only documents that were created by the current user
    return {
      id: {
          equals: user.id,
      }
    }
  }

  // Scenario #3 - Disallow all others
  return false;
}

const isNotSelf = ({ req: { user } }) => {
  // Scenario #2 - Allow only documents with the current user set to the 'createdBy' field
  if (user) {
    // Will return access for only documents that were created by the current user
    return {
        id: {
            not_equals: user.id,
        }
    }
  }

  // Scenario #3 - Disallow all others
  return false;
}

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
      read: () => true,
      create: AccessControl.isAdmin,
      update: isAdminDevOrSelf,
      delete: AccessControl.isAdmin,
  },
  fields: [
    {
      name: 'firstName', type: 'text', 
      label: 'First Name',
      required: true
    },
    {
      name: 'lastName', type: 'text',
      label: 'Last Name', 
      required: true
    },
    {
      name: 'role', type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Dev', value: 'dev' },
        { label: 'User', value: 'user' }
      ],
      access: {
        update: AccessControl.isAdmin,
      },
      required: true,
      defaultValue: 'user',
    }, 
    { name: 'relacion', type: 'relationship', 
      relationTo: 'users',
      hasMany: true,
      filterOptions: async ({ user }) => {
        return {
          id: {
            not_equals: user?.id
          }
        }
      }
    },
    {
      name: 'citas', type: 'relationship',
      relationTo: 'citas',
      hasMany: true
    }
  ],
  hooks: {
    afterChange: [async ({ operation, req: {payload}, req: {user}, doc}) => {
      if (operation == 'create') {
      }
    }]
  }
}

export default Users
