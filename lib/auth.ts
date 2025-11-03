// Simple authentication utilities
export interface User {
  email: string;
  name: string;
}

export function saveUser(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
}

export function login(email: string, password: string): User | null {
  // Simple mock authentication - in production, use proper backend
  const users = getStoredUsers();
  const user = users.find((u: any) => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    saveUser(userWithoutPassword);
    return userWithoutPassword;
  }
  return null;
}

export function signup(email: string, password: string, name: string): User {
  const users = getStoredUsers();
  const newUser = { email, password, name };
  users.push(newUser);
  saveStoredUsers(users);
  
  const { password: _, ...userWithoutPassword } = newUser;
  saveUser(userWithoutPassword);
  return userWithoutPassword;
}

function getStoredUsers() {
  if (typeof window !== 'undefined') {
    const usersStr = localStorage.getItem('users');
    return usersStr ? JSON.parse(usersStr) : [];
  }
  return [];
}

function saveStoredUsers(users: any[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('users', JSON.stringify(users));
  }
}

