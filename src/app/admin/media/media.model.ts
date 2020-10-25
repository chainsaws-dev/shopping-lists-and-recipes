export class FiLe {
  public ID: number;
  public Filename: string;
  public Filesize: number;
  public Filetype: string;
  public FileID: string;
}

export class FilesResponse {
  public Users: FiLe[];
  public Total: number;
  public Offset: number;
  public Limit: number;
}
