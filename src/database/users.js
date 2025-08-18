class UsersDatabase {
  constructor() {
    this.users = [
      {
        id: 1,
        name: "admin",
        email: "admin@sps.com",
        type: "admin",
        password: "admin123"
      }
    ];
    this.nextId = 2;
  }

  getAllUsers() {
    return this.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  getUserById(id) {
    return this.users.find(user => user.id === id);
  }

  getUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  createUser(userData) {
    const existingUser = this.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: this.nextId++,
      ...userData
    };

    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, userData) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    if (userData.email && userData.email !== this.users[userIndex].email) {
      const existingUser = this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData
    };

    return this.users[userIndex];
  }

  deleteUser(id) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    if (this.users[userIndex].type === 'admin') {
      throw new Error('Cannot delete admin user');
    }

    const deletedUser = this.users.splice(userIndex, 1)[0];
    return deletedUser;
  }

  authenticateUser(email, password) {
    const user = this.getUserByEmail(email);
    if (!user || user.password !== password) {
      return null;
    }
    return user;
  }
}

const usersDB = new UsersDatabase();

module.exports = usersDB;
