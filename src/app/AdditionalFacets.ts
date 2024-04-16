import { Facet } from "../base/facet";

export interface TitleProps {
  title: string;
}

export class TitleFacet extends Facet<TitleProps>{
  constructor(props: TitleProps) {
    super(props);
  }
}