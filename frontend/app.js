const { createApp } = Vue;

createApp({
  data() {
    return {
      apiBaseUrl: "http://127.0.0.1:8000/api/tasks/",
      tasks: [],
      loading: false,
      errorMessage: "",
      selectedStatus: "",
      form: {
        title: "",
        description: "",
        status: "OPEN",
      },
    };
  },

  methods: {
    buildTasksUrl() {
      const url = new URL(this.apiBaseUrl);

      url.searchParams.set("format", "json");

      if (this.selectedStatus) {
        url.searchParams.set("status", this.selectedStatus);
      }

      return url.toString();
    },

    async fetchTasks() {
      this.loading = true;
      this.errorMessage = "";

      try {
        const response = await fetch(this.buildTasksUrl(), {
          headers: {
            Accept: "application/json",
          },
        });

        const text = await response.text();
        console.log("GET /api/tasks response:", text);

        if (!response.ok) {
          throw new Error(`Failed to fetch tasks. Status: ${response.status}`);
        }

        const data = JSON.parse(text);

        if (Array.isArray(data)) {
          this.tasks = data;
        } else if (Array.isArray(data.results)) {
          this.tasks = data.results;
        } else {
          this.tasks = [];
        }
      } catch (error) {
        console.error("fetchTasks error:", error);
        this.errorMessage = error.message || "Failed to load tasks.";
        this.tasks = [];
      } finally {
        this.loading = false;
      }
    },

    async createTask() {
      this.errorMessage = "";

      try {
        const response = await fetch(this.apiBaseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(this.form),
        });

        const text = await response.text();
        console.log("POST /api/tasks response:", text);

        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
          this.errorMessage = JSON.stringify(data);
          return;
        }

        this.form = {
          title: "",
          description: "",
          status: "OPEN",
        };

        await this.fetchTasks();
      } catch (error) {
        console.error("createTask error:", error);
        this.errorMessage = error.message || "Failed to create task.";
      }
    },

    prettyStatus(status) {
      const map = {
        OPEN: "Open",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
      };
      return map[status] || status;
    },

    badgeClass(status) {
      const map = {
        OPEN: "badge-open",
        IN_PROGRESS: "badge-progress",
        COMPLETED: "badge-completed",
      };
      return map[status] || "";
    },

    formatDate(value) {
      if (!value) return "-";
      return new Date(value).toLocaleString();
    },
  },

  mounted() {
    this.fetchTasks();
  },
}).mount("#app");