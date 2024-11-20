export default {
    isAdmin: ({ req: { user } }) => {
        // Check if user has the 'admin' role
        if (user && user.role === 'admin') {
            return true;
        }
        return false
    },
    isAdminOrDev: ({ req: { user } }) => {
        // Check if user has the 'admin' role
        if (user && (user.role === 'admin' || user.role === 'dev')) {
            return true;
        }
        return false
    }, 
    isAdminDevOrCreatedBy: ({ req: { user } }) => {
        if (user) {
            // Check if user has the 'admin' or 'dev' role
            if (user.role === 'admin' || user.role === 'dev') {
                return true;
            }
            // Return Query Constraint to allow only documents with the current user set to the 'createdBy' field
            return {
                createdBy: {
                    equals: user.id
                }
            }
        }
        // Disallow all others
        return false;
      }
}