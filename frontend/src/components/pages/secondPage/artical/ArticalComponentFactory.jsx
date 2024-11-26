import { ArticleTextContainer } from "@/components/pages/secondPage/artical/components/ArticalText";
import { ArticleTitleContainer } from "@/components/pages/secondPage/artical/components/ArticalHeadline";
import { ArticleImageContainer } from "@/components/pages/secondPage/artical/components/ArticalImage";

// Specify here how a `componentTitle` refers to an actual React Article component
export const componentsMap = {
  title: ArticleTitleContainer,
  text: ArticleTextContainer,
  image: ArticleImageContainer,
};

export const componentFactoryEditor = (id, type, editProps) => {
  const Component = componentsMap[type];
  if (!Component) {
    console.warn(
      `componentFactoryEditor: component of type ${type} has not been found in the componentsMap`
    );
    return null;
  }

  if (editProps.content == null) {
    editProps.content = Component.defaultContent;
  }

  return (
      <Component.Editor {...editProps} />
  );
};