export interface UserCredentials {
  UID: string;
  Name:string;
  Email: string;
  Password: string;
  CID:string;
  IsActive?:boolean;
}

export interface CompanyCredentials {
  CID:string; 
  CompanyName: string;
  Address: string;
  Phone: string;
  GSTIN:string;
  IsActive?:boolean;
}

export interface RoleCredentials {
  RID:string;
  Name:string;
}

export interface UserRole {
  UID: string;
  RID: string;
}



export interface ResponseType<T> {
  isSuccess: boolean;
  data: T | null;
  message: string;
  statusCode?:number;
  pagination?: any;
  error?: any;
}

export interface fileType{
    filename:string,
    path: string
}

export interface userTokenSchema{
  UID:string,
  Token:string[],
} 

export interface AttachementSchema{
  FileName: string;
  FileType:string;
  Url:string;
  Hash:string;
}

export interface UserSecretKeySchema{
  UID:string,
  secretKey:string
  isActive:boolean
  createdBy:string;
} 