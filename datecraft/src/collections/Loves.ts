import { CollectionConfig } from 'payload/types'

const isNotSelf = ({ req: { user } }) => {
  // Scenario #2 - Allow only documents with the current user set to the 'createdBy' field
  if (user) {
    // Will return access for only documents that were created by the current user
    return {
        user: {
            not_equals: user.id,
        }
    }
  }

  // Scenario #3 - Disallow all others
  return false;
}

const Loves: CollectionConfig = {
  slug: 'loves',
  admin: {
    useAsTitle: 'firstName',
  },
  access: {
      read: () => true
  },
  fields: [
    {
      name: 'user', type: 'relationship', 
      relationTo: 'users',
      required: true
    },
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'wishes', type: 'relationship', hasMany: true, relationTo: 'wishes' }
  ],
}

export default Loves
