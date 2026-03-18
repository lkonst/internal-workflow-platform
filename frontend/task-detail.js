const { createApp } = Vue;

createApp({
  data() {
    return {
      apiBaseUrl: "http://127.0.0.1:8000/api/tasks/",
      task: null,
      loading: false,
      saving: false,
      errorMessage: "",
      updateErrorMessage: "",
      successMessage: "",
      selectedStatus: "",
    };
  },

  computed: {
    availableStatuses() {
      if (!this.task) return [];

      const transitions = {
        OPEN: ["OPEN", "IN_PROGRESS"],
        IN_PROGRESS: ["IN_PROGRESS", "COMPLETED"],
        COMPLETED: ["COMPLETED"],
      };

      return transitions[this.task.status] || [this.task.status];
    },
  },

  methods: {
    getTaskIdFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return params.get("id");
    },

    buildTaskUrl() {
      const taskId = this.getTaskIdFromUrl();
      return `${this.apiBaseUrl}${taskId}/?format=json`;
    },

    async fetchTask() {
      this.loading = true;
      this.errorMessage = "";

      try {
        const taskId = this.getTaskIdFromUrl();

        if (!taskId) {
          throw new Error("Task id was not provided in the URL.");
        }

        const response = await fetch(this.buildTaskUrl(), {
          headers: {
            Accept: "application/json",
          },
        });

        const text = await response.text();
        console.log("GET task detail response:", text);

        if (!response.ok) {
          throw new Error(`Failed to fetch task. Status: ${response.status}`);
        }

        const data = JSON.parse(text);
        this.task = data;
        this.selectedStatus = data.status;
      } catch (error) {
        console.error("fetchTask error:", error);
        this.errorMessage = error.message || "Failed to load task.";
      } finally {
        this.loading = false;
      }
    },

    async updateStatus() {
      this.saving = true;
      this.updateErrorMessage = "";
      this.successMessage = "";

      try {
        const response = await fetch(this.buildTaskUrl(), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            status: this.selectedStatus,
          }),
        });

        const text = await response.text();
        console.log("PATCH task response:", text);

        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
          this.updateErrorMessage = typeof data === "object"
            ? JSON.stringify(data)
            : "Failed to update task status.";
          return;
        }

        this.task = data;
        this.selectedStatus = data.status;
        this.successMessage = "Task status updated successfully.";
      } catch (error) {
        console.error("updateStatus error:", error);
        this.updateErrorMessage = error.message || "Failed to update task status.";
      } finally {
        this.saving = false;
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
    this.fetchTask();
  },
}).mount("#detailApp");