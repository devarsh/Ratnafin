export interface GroupItemType {
  docID: string;
  docLabel: string;
  docDescription?: string;
  status: string; //N-not uploaded P-Uploaded V-Verified R-Rejected
}

export interface GroupType {
  groupCode: string;
  groupName: string;
  items: GroupItemType[];
}

export interface APITemplateData {
  docDescription: string;
  docID: string;
  docTitle: string;
  doc_type: string;
  groupLabel: string;
  status: string;
}
