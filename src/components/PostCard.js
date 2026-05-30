import { db, auth } from "../firebase/config";
import { deleteDoc, doc } from "firebase/firestore";

export const PostCard = ({ post, setToggle }) => {
    const { id, title, description, author } = post;
    const isAuth = JSON.parse(localStorage.getItem("isAuth") || false);

    async function handleDelete(event) {
        // console.log(event);
        const document = doc(db, "posts", id);
        await deleteDoc(document);
        setToggle((prevState) => {
            return !prevState;
        });
    }

    return (
        <div className="card">
            <p className="title">{title}</p>
            <p className="description">{description}</p>
            <p className="control">
                <span className="author">{author.name}</span>
                {isAuth && auth.currentUser.uid === author.id && (
                    <span onClick={handleDelete} className="delete">
                        <i className="bi bi-trash3"></i>
                    </span>
                )}
            </p>
        </div>
    );
};
