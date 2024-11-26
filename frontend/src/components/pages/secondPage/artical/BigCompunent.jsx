import React from 'react';
import {componentFactoryEditor} from '@/components/pages/secondPage/artical/ArticalComponentFactory';

const mapContentToComponents = (content, media) => {
    const randomMedia = media[Math.floor(Math.random() * media.length)];
    const randomStyle = Math.random() > 0.5 ? "square" : "full";
    return [
        {
            id: "0",
            type: "title",
            content: {
                text: content.subheader,
                type: "subtitle",
            },
        },
        {
            id: "1",
            type: "text",
            content: {
                text: content.text,
            },
        },
        {
            id: "2",
            type: "image",
            content: {
                fileUrl: randomMedia.url,
                altText: randomMedia.altText,
                style: randomStyle,
                exchangeMedia: media,
            },
        }
    ];
};

const ArticalContent = ({content, media}) => {
    const [components, setComponents] = React.useState(mapContentToComponents(content, media));

    const updateComponentContent = (id, newContent) => {
        setComponents((prev) => {
            const componentIndex = prev.findIndex((component) => component.id === id);
            if (componentIndex === -1) {
                return prev;
            }

            const newComponents = [...prev];
            newComponents[componentIndex] = {
                ...newComponents[componentIndex],
                content: newContent,
            };

            return newComponents;
        });
    };
    const deleteComponent = (id) => {
        setComponents((prev) => {
            const newComponents = prev.filter((component) => component.id !== id);
            return newComponents;
        });
    };

    return (
        <div>
            {components.map((component) => (
                <div key={component.id} className="mb-2">
                    {componentFactoryEditor(component.id, component.type, {
                        content: component.content,
                        onContentChange: (newContent) => updateComponentContent(component.id, newContent),
                        onDelete: () => deleteComponent(component.id),
                    })}
                </div>
            ))}
        </div>
    );
};

export default ArticalContent;