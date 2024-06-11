export type PermissionValues = {
  id: number;
  name: string;
};

export type RoleValues = {
  id: number;
  name: string;
  permissions: PermissionValues[];
};

export type PermissionsDialogProps = {
  open: boolean;
  onClose: () => void;
  permissions: PermissionValues[];
  roleName?: string;
};

export type modulesListType = {
  id: number;
  title: string;
  name: string;
  icon: React.ReactNode;
};
