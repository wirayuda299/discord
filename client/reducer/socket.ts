import { SocketStates } from "@/types/socket-states";


type AllowedActionType =
  | "CHANNEL_MESSAGES"
  | "ACTIVE_USERS"
  | "PERSONAL_MESSAGES"
  | "THREAD_MESSAGES"
  | 'SET_USER_ROLES'
  | 'BANNED_MEMBERS'

type ActionType = {
  type: AllowedActionType;
  payload: any
};

export function socketReducer(states: SocketStates, action: ActionType) {
  switch (action.type) {
    case "ACTIVE_USERS":
      return {
        ...states,
        active_users: action.payload,
      };
    case "PERSONAL_MESSAGES":
      return {
        ...states,
        personal_messages: action.payload,
      };
    case "CHANNEL_MESSAGES":
      return {
        ...states,
        channel_messages: action.payload,
      };

    case "THREAD_MESSAGES":
      return {
        ...states,
        thread_messages: action.payload,
      };
    case "SET_USER_ROLES":
      return {
        ...states,
        user_roles: action.payload,
      };
    case "BANNED_MEMBERS":
      return {
        ...states,
        banned_members: action.payload,
      };

    default:
      throw new Error("Invalid action: " + action.type);
  }
}
