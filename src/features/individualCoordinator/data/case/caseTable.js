export const caseData = {
  data: [
    {
      id: "case_0001",
      file_number: "BANK-12345",
      customer_name: "Rahul Sharma",
      customer_phone_number: "9876543210",

      branch: {
        branch_id: "branch_001",
        name: "Noida",
      },

      bank: {
        bank_id: "bank_001",
        display_name: "HDFC (Sector-18)",
        name: "HDFC",
        branch_code: "HDFC001",
        branch_name: "Sector-18",
        gst_number: "27AAECS1234F1Z5",
        branch_manager: "Ramesh Kumar",
        branch_manager_contact: "9876543210",
        address: {
          lane: "MG Road",
          landmark: "Near City Mall",
          city: "Noida",
          district: "Gautam Budh Nagar",
          state: "Uttar Pradesh",
          pin_code: "201301",
          country: "India",
        },
      },

      banker: "Praveen Kumar",
      case_type: "Awaas",
      business_type: { business_type_id: "bt_001", name: "Retail" },

      address: {
        lane: "MG Road",
        landmark: "Near City Mall",
        city: "Noida",
        district: "Gautam Budh Nagar",
        state: "Uttar Pradesh",
        pin_code: "201301",
        country: "India",
      },

      created_by: {
        id: "user_001",
        first_name: "John",
      },

      updated_by: [
        {
          id: "user_002",
          first_name: "Naina",
          timestamp: "2026-01-15T11:15:00Z",
        },
      ],

      engineer: {
        id: "eng_001",
        name: "Amit Singh",
        phone_number: "9123456789",
      },

      remarks: [
        {
          user: {
            first_name: "John",
            role: { name: "Super Admin" },
            department: { name: "Management" },
          },
          comment: "Initial case created.",
          date: "2026-07-03",
          time: "10:30 AM",
        },
      ],

      status: "REPORT_SUBMITTED",
      created_at: "2026-01-15T10:30:00Z",
      updated_at: "2026-01-15T11:15:00Z",
      deleted_at: null,
      is_active: true,
    },

    {
      id: "case_0002",
      file_number: "BANK-12346",
      customer_name: "Priya Verma",
      customer_phone_number: "9812345678",

      branch: {
        branch_id: "branch_002",
        name: "Lucknow",
      },

      bank: {
        bank_id: "bank_002",
        display_name: "ICICI (Hazratganj)",
        name: "ICICI",
        branch_code: "ICIC002",
        branch_name: "Hazratganj",
        gst_number: "09AABCI1234F1Z2",
        branch_manager: "Suresh Yadav",
        branch_manager_contact: "9812345600",
        address: {
          lane: "Ashok Marg",
          landmark: "Near GPO",
          city: "Lucknow",
          district: "Lucknow",
          state: "Uttar Pradesh",
          pin_code: "226001",
          country: "India",
        },
      },

      banker: "Anjali Mishra",
      case_type: "Vyapaar",
      business_type: { business_type_id: "bt_002", name: "Wholesale" },

      address: {
        lane: "Ashok Marg",
        landmark: "Near GPO",
        city: "Lucknow",
        district: "Lucknow",
        state: "Uttar Pradesh",
        pin_code: "226001",
        country: "India",
      },

      created_by: {
        id: "user_003",
        first_name: "Meera",
      },

      updated_by: [
        {
          id: "user_003",
          first_name: "Meera",
          timestamp: "2026-02-10T09:45:00Z",
        },
      ],

      engineer: {
        id: "eng_002",
        name: "Deepak Yadav",
        phone_number: "9234567890",
      },

      remarks: [
        {
          user: {
            first_name: "Meera",
            role: { name: "Coordinator" },
            department: { name: "Operations" },
          },
          comment: "Site visit scheduled.",
          date: "2026-02-09",
          time: "02:15 PM",
        },
      ],

      status: "VISIT_SCHEDULED",
      created_at: "2026-02-08T09:00:00Z",
      updated_at: "2026-02-10T09:45:00Z",
      deleted_at: null,
      is_active: true,
    },

    {
      id: "case_0003",
      file_number: "BANK-12347",
      customer_name: "Vikram Singh",
      customer_phone_number: "9765432109",

      branch: {
        branch_id: "branch_003",
        name: "Kanpur",
      },

      bank: {
        bank_id: "bank_003",
        display_name: "SBI (Civil Lines)",
        name: "SBI",
        branch_code: "SBI003",
        branch_name: "Civil Lines",
        gst_number: "09AAACS1234F1Z8",
        branch_manager: "Vinod Tripathi",
        branch_manager_contact: "9765432100",
        address: {
          lane: "Mall Road",
          landmark: "Near Phool Bagh",
          city: "Kanpur",
          district: "Kanpur Nagar",
          state: "Uttar Pradesh",
          pin_code: "208001",
          country: "India",
        },
      },

      banker: "Rakesh Gupta",
      case_type: "Awaas",
      business_type: { business_type_id: "bt_003", name: "Manufacturing" },

      address: {
        lane: "Mall Road",
        landmark: "Near Phool Bagh",
        city: "Kanpur",
        district: "Kanpur Nagar",
        state: "Uttar Pradesh",
        pin_code: "208001",
        country: "India",
      },

      created_by: {
        id: "user_004",
        first_name: "Arjun",
      },

      updated_by: [
        {
          id: "user_004",
          first_name: "Arjun",
          timestamp: "2026-03-05T14:20:00Z",
        },
      ],

      engineer: {
        id: "eng_003",
        name: "Sanjay Rathore",
        phone_number: "9345678901",
      },

      remarks: [
        {
          user: {
            first_name: "Arjun",
            role: { name: "Engineer" },
            department: { name: "Field Operations" },
          },
          comment: "Visit completed, report under review.",
          date: "2026-03-05",
          time: "11:00 AM",
        },
      ],

      status: "VISIT_COMPLETED",
      created_at: "2026-03-01T10:00:00Z",
      updated_at: "2026-03-05T14:20:00Z",
      deleted_at: null,
      is_active: true,
    },

    {
      id: "case_0004",
      file_number: "BANK-12348",
      customer_name: "Sunita Devi",
      customer_phone_number: "9654321098",

      branch: {
        branch_id: "branch_004",
        name: "Ghaziabad",
      },

      bank: {
        bank_id: "bank_004",
        display_name: "PNB (Kavi Nagar)",
        name: "PNB",
        branch_code: "PNB004",
        branch_name: "Kavi Nagar",
        gst_number: "09AAACP1234F1Z6",
        branch_manager: "Alok Sharma",
        branch_manager_contact: "9654321000",
        address: {
          lane: "Kavi Nagar Road",
          landmark: "Near Ambedkar Park",
          city: "Ghaziabad",
          district: "Ghaziabad",
          state: "Uttar Pradesh",
          pin_code: "201002",
          country: "India",
        },
      },

      banker: "Neha Kapoor",
      case_type: "Vyapaar",
      business_type: { business_type_id: "bt_004", name: "Services" },

      address: {
        lane: "Kavi Nagar Road",
        landmark: "Near Ambedkar Park",
        city: "Ghaziabad",
        district: "Ghaziabad",
        state: "Uttar Pradesh",
        pin_code: "201002",
        country: "India",
      },

      created_by: {
        id: "user_005",
        first_name: "Rohit",
      },

      updated_by: [
        {
          id: "user_005",
          first_name: "Rohit",
          timestamp: "2026-04-12T16:30:00Z",
        },
      ],

      engineer: {
        id: "eng_004",
        name: "Manoj Tiwari",
        phone_number: "9456789012",
      },

      remarks: [
        {
          user: {
            first_name: "Rohit",
            role: { name: "Coordinator" },
            department: { name: "Operations" },
          },
          comment: "Pending documents from customer.",
          date: "2026-04-12",
          time: "04:30 PM",
        },
      ],

      status: "PENDING",
      created_at: "2026-04-10T11:15:00Z",
      updated_at: "2026-04-12T16:30:00Z",
      deleted_at: null,
      is_active: true,
    },

    {
      id: "case_0005",
      file_number: "BANK-12349",
      customer_name: "Manoj Pandey",
      customer_phone_number: "9543210987",

      branch: {
        branch_id: "branch_005",
        name: "Meerut",
      },

      bank: {
        bank_id: "bank_005",
        display_name: "Axis Bank (Begum Bridge)",
        name: "Axis Bank",
        branch_code: "AXIS005",
        branch_name: "Begum Bridge",
        gst_number: "09AAACA1234F1Z4",
        branch_manager: "Kavita Rana",
        branch_manager_contact: "9543210900",
        address: {
          lane: "Begum Bridge Road",
          landmark: "Near Bachha Park",
          city: "Meerut",
          district: "Meerut",
          state: "Uttar Pradesh",
          pin_code: "250001",
          country: "India",
        },
      },

      banker: "Sandeep Chauhan",
      case_type: "Awaas",
      business_type: { business_type_id: "bt_005", name: "Retail" },

      address: {
        lane: "Begum Bridge Road",
        landmark: "Near Bachha Park",
        city: "Meerut",
        district: "Meerut",
        state: "Uttar Pradesh",
        pin_code: "250001",
        country: "India",
      },

      created_by: {
        id: "user_006",
        first_name: "Kiran",
      },

      updated_by: [
        {
          id: "user_006",
          first_name: "Kiran",
          timestamp: "2026-05-20T13:10:00Z",
        },
      ],

      engineer: {
        id: "eng_005",
        name: "Ravi Chandra",
        phone_number: "9567890123",
      },

      remarks: [
        {
          user: {
            first_name: "Kiran",
            role: { name: "Super Admin" },
            department: { name: "Management" },
          },
          comment: "Case rejected due to incomplete documentation.",
          date: "2026-05-20",
          time: "01:10 PM",
        },
      ],

      status: "REJECTED",
      created_at: "2026-05-15T09:30:00Z",
      updated_at: "2026-05-20T13:10:00Z",
      deleted_at: null,
      is_active: false,
    },
  ],

  meta: {
    total_cases: 5,
    visit_completed: 1,
  },
};
