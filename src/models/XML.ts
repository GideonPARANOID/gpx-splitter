import { XMLBuilder, XMLParser } from 'fast-xml-parser';

export default class XML<T extends object> {
  private static defaultArgs = { ignoreAttributes: false };
  private static parser = new XMLParser(XML.defaultArgs);
  private static builder = new XMLBuilder(XML.defaultArgs);

  public parse(raw: string): T {
    return XML.parser.parse(raw);
  }

  public build(data: T): string {
    return XML.builder.build(data);
  }
}
