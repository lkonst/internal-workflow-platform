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
    async fetchTasks() {
      this.loading = true;
      this.errorMessage = "";

      try {
        let url = this.apiBaseUrl;

        if (this.selectedStatus) {
          url += `?status=${encodeURIComponent(this.selectedStatus)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch tasks.");
        }

        this.tasks = await response.json();
      } catch (error) {
        this.errorMessage = error.message;
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
          },
          body: JSON.stringify(this.form),
        });

        const data = await response.json();

        if (!response.ok) {
          if (typeof data === "object") {
            this.errorMessage = JSON.stringify(data);
          } else {
            this.errorMessage = "Failed to create task.";
          }
          return;
        }

        this.form = {
          title: "",
          description: "",
          status: "OPEN",
        };

        await this.fetchTasks();
      } catch (error) {
        this.errorMessage = error.message;
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