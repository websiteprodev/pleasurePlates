import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = async (handle) => {
  try {
    const snapshot = await get(ref(db, `users/${handle}`));
    return snapshot.val();
  } catch (error) {
    console.error('Error fetching user by handle:', error);
    throw new Error('Unable to fetch user.');
  }
};

export const createUserHandle = async (handle, uid, email) => {
  const user = { handle, uid, email, createdOn: new Date().toString() };
  try {
    await set(ref(db, `users/${handle}`), user);
  } catch (error) {
    console.error('Error creating user handle:', error);
    throw new Error('Unable to create user handle.');
  }
};

export const getUserData = async (uid) => {
  try {
    const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
    if (!snapshot.exists()) {
      throw new Error('User not found!');
    }
    return snapshot.val();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Unable to fetch user data.');
  }
};

export const getUserNameByHandle = async (handle) => {
  try {
    const user = await getUserByHandle(handle);
    return user?.firstName || handle; 
  } catch (error) {
    console.error('Error fetching user name by handle:', error);
    throw new Error('Unable to fetch user name.');
  }
};

export const saveUserDetails = async ({ handle, uid, email, lastName, phoneNumber = null, profilePicture = null }) => {
  try {
    const userDetails = {
      handle,
      uid,
      email,
      lastName,
      phoneNumber,
      profilePicture,
      createdOn: new Date().toISOString(),
    };

    await set(ref(db, `users/${handle}`), userDetails);
  } catch (error) {
    console.error('Error saving user details:', error);
    throw new Error('Unable to save user details.');
  }
};


/**
* Updates a specific detail of a user in the database.
*
* @param {string} handle - The handle of the user to update.
* @param {string} target - The field of the user to update.
* @param {any} value - The new value for the specified field.
* @returns {Promise<void>} A promise that resolves when the user detail is updated.
* @throws {Error} If there is an error updating the user detail in the database.
*/
export const updateUserDetails = async (handle, target, value) => {
  try {
    const updateObject = {
      [`users/${handle}/${target}`]: value,
    }

    await update(ref(db), updateObject);
  } catch (error) {
    console.error('Error saving user details:', error.message);
  }
}

export const getAllUsers = async () => {
  try {
    const snapshot = await get(ref(db, 'users'));
    if (!snapshot.exists()) {
      throw new Error('No users found!');
    }
    return snapshot.val();
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('Unable to fetch users.');
  }
};

export const toggleUserBlockStatus = async (userHandle, blockStatus) => {
  try {
    await update(ref(db, `users/${userHandle}`), { isBlocked: blockStatus });
    console.log(`User ${userHandle} ${blockStatus ? 'blocked' : 'unblocked'} successfully.`);
  } catch (error) {
    console.error('Error updating user block status:', error);
    throw new Error('Unable to update user block status.');
  }
};
