export type PermissionValues = {
  type: string;
  id: number;
  name: string;
};

export type RoleValues = {
  id: number;
  name: string;
  permissions: PermissionValues[];
  permissionsIds: string;
};

export type PermissionsProps = {
  permissions: PermissionValues[];
  roleName?: string;
  permissionsToSave: []; 
  setPermissionsToSave: () => void;
};

export type modulesListType = {
  id: number;
  title: string;
  name: string;
  icon: React.ReactNode;
};
