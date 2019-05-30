import React from 'react';
import {useState, useEffect} from 'react';
import './App.css';

function Chapter(props) {
    const [chapter, setChapter] = useState(null);
    const [editing, setEditing] = useState(false);

    const id = `chapter-${props.id}`;

    useEffect(() => {
        if (props.chapter) {
            setChapter(props.chapter);
        }
    }, [props.chapter]);

    useEffect(() => {
        if (editing) {
            document.getElementById(id).focus();
        }
    }, [editing, id]);

    return (
        <>
            {!editing &&
            <h1 onClick={(e) => {e.stopPropagation(); setEditing(true)}}>{chapter && chapter.title}</h1>
            }
            {editing &&
            <input
                id={id}
                type="text"
                value={chapter.title}
                onClick={(e) => { e.stopPropagation(); }}
                onChange={event => setChapter({...chapter, title: event.target.value})}
                onBlur={() => { setEditing(false); props.onUpdate(chapter); }}
            />
            }
        </>
    );
}

function Note(props) {
    const [title, setTitle] = useState('title');
    const [editing, setEditing] = useState(false);

    const id = `note${props.id}`;

    useEffect(() => {
        if (editing) {
            document.getElementById(id).focus();
        }
    }, [editing, id]);

    function click() {
        if (editing) {
            setEditing(false);
            props.onUpdateTitle(title);
        } else {
            props.onClick();
        }
    }

    const editTitle = (e) => {
        e.stopPropagation();
        setEditing(true);
        props.onEditTitle();
    };

    return (
        <div className='note' onClick={() => click()}>
            {!editing &&
                <div onClick={e => editTitle(e)}>{props.note.title}</div>
            }
            {editing &&
                <input
                    id={id}
                    type="text"
                    value={title}
                    onClick={e => e.stopPropagation()}
                    onChange={event => setTitle(event.target.value)}
                />
            }
        </div>
    );
}

function AddNote(props) {
    const [title, setTitle] = useState('title');
    const [editing, setEditing] = useState(false);

    const id = `note${props.id}`;

    useEffect(() => {
        if (editing) {
            document.getElementById(id).focus();
        }
    }, [editing, id]);

    return (
        <div className="addNote">
            {!editing && <div onClick={() => setEditing(true)}>+</div>}
            {editing &&
                <input
                    id={id}
                    type="text"
                    value={title}
                    onClick={(e) => { e.stopPropagation(); }}
                    onChange={(event) => setTitle(event.target.value)}
                    onBlur={() => { setEditing(false); props.addNote(title); } }
                />
            }
        </div>
    )
}

function Editor(props) {
    const [chapterId, setChapterId] = useState(null);
    const [note, setNote] = useState(null);
    const [content, setContent] = useState('');

    useEffect(() => {
        if (props.chapterId) {
            setChapterId(props.chapterId);
        }
        if (props.note) {
            setNote(props.note);
            setContent(props.note.content);
        }
    }, [props.note, props.chapterId]);

    const save = () => {
        note.content = content;
        setNote(note);
        props.onSave(chapterId, note);
    };

    return (
        <div className="editorComponent">
            <h1>{props.note.title}</h1>
            <textarea
                rows="10"
                cols="20"
                value={content}
                onChange={e => setContent(e.target.value)}
            />
            <button onClick={save}>save</button>
        </div>
    )
}

let notes = [
    {id: 0, title: '1', content: '1'},
];

let chaptersData = [
    {id: 1, title: 'Chapter 1', notes},
    {id: 2, title: 'Chapter 2', notes: []},
];

function App() {
    const [editor, showEditor] = useState(null);
    const [chapters, setChapters] = useState(chaptersData);

    const updateNote = (chapterId, note) => {
        showEditor(false);

        let newChapters = Object.assign([], chapters);
        let chapter = newChapters.find(c => c.id === chapterId);
        chapter.notes = chapter.notes.map(n => n.id === note.id ? note : n);
        setChapters(newChapters);
    };

    const saveNoteTitle = (chapterId, noteId, title) => {
        let newChapters = Object.assign([], chapters);
        let chapter = newChapters.find(c => c.id === chapterId);
        chapter.notes = chapter.notes.map(n => {
            if (n.id === noteId) {
                n.title = title;
            }

            return n;
        });
        setChapters(newChapters);
    };

    const updateChapter = (chapter) => {
        let newChapters = Object.assign([], chapters);
        newChapters = newChapters.map(c => c.id === chapter.id ? chapter : c);
        setChapters(newChapters);
    };

    const addNote = (chapter, title) => {
        let newChapters = Object.assign([], chapters);

        let notes = newChapters.find(c => c.id === chapter.id).notes.map(c => c.id);
        let max = notes.reduce((acc, curr) => Math.max(acc, curr), -1);
        newChapters = newChapters.map(c => {
            if (c.id === chapter.id) {
                c.notes.push({id: max + 1, title: title, content: ''});
            }
            return c;
        });

        setChapters(newChapters);
    };

    return (
        <div className="App">
            <div className="index">
                {chapters.map(chapter =>
                    <div key={chapter.id}>
                        <Chapter
                            chapter={chapter}
                            onUpdate={(chapter) => updateChapter(chapter)}
                        />
                        {chapter.notes.map(note =>
                            <Note
                                key={chapter.id + '-' + note.id}
                                id={note.id}
                                note={note}
                                onClick={() => showEditor({chapterId: chapter.id, note})}
                                onEditTitle={() => showEditor(false)}
                                onUpdateTitle={title => saveNoteTitle(chapter.id, note.id, title)}
                            />
                        )}
                        <AddNote addNote={title => addNote(chapter, title)} />
                    </div>
                )}
            </div>
            <div className="editor">
                {editor &&
                <Editor
                    chapterId={editor.chapterId}
                    note={editor.note}
                    onSave={(chapterId, note) => updateNote(chapterId, note)}
                />}
            </div>
            <pre>{JSON.stringify(chapters, null, ' ')}</pre>
        </div>
    );
}

export default App;