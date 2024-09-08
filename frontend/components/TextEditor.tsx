import { 
  useState,
  useCallback,
  useMemo,
  ChangeEvent,
  KeyboardEvent
} from 'react';
import { 
  createEditor,
  BaseEditor,
  Descendant,
  Transforms,
  Element,
  Node,
  Range,
  Path,
  Editor
} from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import FileInput from './FileInput';

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }
type ImageElement = { 
  type: string;
  url: string;
  file_name: string;
  children: CustomText[],
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement | ImageElement
    Text: CustomText
  }
}

const initialValue: CustomElement[] = [
  {
    type: "paragraph",
    children: [{ text: 'A line of text in a paragraph' }]
  }
]

const ImageElement = (props: { attributes: any, element: any, children: any }) => {
  return (
  <div {...props.attributes} className="flex">
    <div contentEditable={false} className="relative">
      <img src={props.element.url}/>
    </div>
    {props.children}
  </div>
  )

}

const DefaultElement = (props: { attributes: any, element: any, children: any }) => {
  return <p {...props.attributes}>{props.children}</p>
}


const withImage = (editor: Editor) => {
  const { isVoid } = editor

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element)
  }

  return editor;
}

export default function TextEditor({ onChange }: { onChange: (newValue: Node[]) => void, className?: string}) {
  const [editor] = useState(() => withImage((withReact(createEditor()))))
  const [files, setFiles] = useState<File[]>([])

  const insertImage = (editor: Editor, url: string, file_name: string) => {
    const text = { text: '' }
    const image: ImageElement = { 
      type: 'image',
      url,
      file_name,
      children: [text],
    }

    Transforms.insertNodes(editor, image)
    Transforms.insertNodes(editor, {
      type: 'paragraph',
      children: [{ text: '' }],
    })
  }

  const renderElement = useCallback((props: { attributes: any, children: any, element: any}) => {
    switch(props.element.type) {
      case "image":
        return <ImageElement {...props}/>
      default:
        return <DefaultElement {...props}/>
    }
  }, [])

  const handleChange = useCallback((newValue: Node[]) => {
    const imgNodes = newValue.filter(n => Element.isElement(n) && n.type === 'image')
    const imagesInEditor = imgNodes.map(n => Node.descendants(n))
    setFiles(files.filter(file => imagesInEditor.some(n => 'file_name' in n && n.file_name === file.name)))

    onChange(newValue);
  }, [onChange]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const file = e.target.files[0]
        const fileSplit = file.name.split('.')
        const baseName = fileSplit.slice(0, -1)
        const ext = fileSplit[fileSplit.length - 1]

        setFiles(oldFiles =>  [...oldFiles, file])
        const newFileName = baseName + '-' +  files.length.toString() + '.' + ext
        insertImage(editor, URL.createObjectURL(new File([file], newFileName)), newFileName)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Backspace') {
      const matches = Array.from(Editor.nodes(editor, {
        match: (n) => Element.isElement(n) && n.type === 'image',
      }));

      if (matches.length > 0) {
        const removePositions = matches.map(match => match[1])
        removePositions.sort((a, b) => b[b.length - 1] - a[a.length -1]);

        removePositions.forEach(pos => {
          console.log(pos)
          Transforms.removeNodes(editor, { at: pos  });
        })
      }
    }
  };

  return (
      <div>
        <div className="rounded-t-md border-2 border-b-0 border-white-20 p-2">
          <FileInput onChange={handleFileChange} accept="png,jpg,jpeg"/>
        </div>
        <Slate editor={editor} initialValue={initialValue} onChange={handleChange} >
          <Editable onKeyDown={handleKeyDown} renderElement={renderElement} className="outline-none p-2 border-2 border-white-20 focus:border-primary rounded-b-md transition-all ease-in-out duration-200"/>
        </Slate>
      </div>
  )
}

interface RichTextProps {
  value: string;
  className?: string;
  withImages?: boolean;
}

export function RichText({ value , className="", withImages=false }: RichTextProps) {
  const editor = useMemo(() => withReact(createEditor()), []);

  const renderElement = useCallback((props: { attributes: any, children: any, element: any}) => {
    switch(props.element.type) {
      case "image":
        return withImages ? (
          <ImageElement {...props}/>
        ) : (
          <span>[image]</span>
        )

      default:
        return <DefaultElement {...props}/>
    }
  }, [])

  return (
    <Slate editor={editor} initialValue={value}>
      <Editable renderElement={renderElement} readOnly className={className}/>
    </Slate>
  );
}

