const data = [
  {
    id: "cmqruschc0000wcp08mmcr53u",
    name: "noida",
    is_active: true,
  },
  {
    id: "cmqruschc0001wcp08mmcr53v",
    name: "delhi",
    is_active: true,
  },
  {
    id: "cmqruschc0002wcp08mmcr53w",
    name: "gurgaon",
    is_active: false,
  },
  {
    id: "cmqruschc0003wcp08mmcr53x",
    name: "bangalore",
    is_active: true,
  },
  {
    id: "cmqruschc0004wcp08mmcr53y",
    name: "mumbai",
    is_active: false,
  },
];

export const branchData = {
  data,
  total_branch: data.length,
  active_branch: data.filter((b) => b.is_active).length,
};
