export const roleData = {
  data: [
    {
      id: "1",
      name: "Admin1",
      department: {
        id: "1",
        name: "Management",
      },
      is_active: true,
    },
    {
      id: "2",
      name: "Branch Manager",
      department: {
        id: "1",
        name: "Management",
      },
      is_active: true,
    },
    {
      id: "3",
      name: "Frontend Engineer",
      department: {
        id: "2",
        name: "Engineering",
      },
      is_active: true,
    },
    {
      id: "4",
      name: "Support Executive",
      department: {
        id: "3",
        name: "Back Office",
      },
      is_active: false,
    },
    {
      id: "5",
      name: "Account Manager",
      department: {
        id: "1",
        name: "Finance Department",
      },
      is_active: true,
    },
  ],

  total_role: 15000,
};

export const departmentData = {
  data: [
    {
      id: "1",
      name: "Management",
      is_active: true,
    },
    {
      id: "2",
      name: "Engineering",
      is_active: true,
    },
    {
      id: "3",
      name: "Back Office",
      is_active: true,
    },
  ],

  total_department: 3,
};

export const roleTableHeader = [
  "S.No",
  "Role Name",
  "Department",
  "Status",
  "Action",
];
