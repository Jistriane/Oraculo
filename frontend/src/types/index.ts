export interface Profile {
  address: string;
  name: string;
  email: string;
  links: {
    title: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
} 