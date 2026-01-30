import { ViewGroup } from "../enums/views.enum";

export interface View {
  _id: string;
  viewGroup: ViewGroup;
  viewRefId: string;
  memberId: string;
  createdAt: Date;
  uptatedAt: Date;
}

export interface ViewInput {
  memberId: string;
  viewRefId: string;
  viewGroup: ViewGroup;
}
