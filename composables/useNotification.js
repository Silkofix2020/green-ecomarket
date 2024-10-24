import { ref } from "vue";

export const useNotification = () => {
  const notificationMessage = ref("");
  const notificationType = ref("success");

  const setNotification = (message, type = "success") => {
    notificationMessage.value = message;
    notificationType.value = type;

    setTimeout(() => {
      notificationMessage.value = "";
    }, 3000);
  };

  return {
    notificationMessage,
    notificationType,
    setNotification,
  };
};
