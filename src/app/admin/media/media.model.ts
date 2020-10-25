export class FiLe {
  public ID: number;
  public Filename: string;
  public Filesize: number;
  public Filetype: string;
  public FileID: string;

  constructor(fname: string, fsize: number, ftype: string, flink: string, ID: number) {
    this.Filename = fname;
    this.Filesize = fsize;
    this.Filetype = ftype;
    this.FileID = flink;
    this.ID = ID;
  }
}

export class FilesResponse {
  public Users: FiLe[];
  public Total: number;
  public Offset: number;
  public Limit: number;
}