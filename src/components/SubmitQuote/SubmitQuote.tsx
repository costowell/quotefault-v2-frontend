import { Button, Card, CardBody, Container, Input } from "reactstrap";
import UserPicker from "../UserPicker";
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCircleMinus, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useApi, useFetchArray } from "../../API/API";
import { CSHUser } from "../../API/Types";
import { toast } from "react-toastify";

interface QuoteEntry {
    id: number,
    speaker: string,
    body: string,
}

const SubmitQuote = () => {

    const { apiPost } = useApi();

    const userList = useFetchArray<CSHUser>("/api/users");

    const [quoteEntries, setQuoteEntries] = useState<QuoteEntry[]>([
        {
            id: 0,
            body: "",
            speaker: "",
        }
    ]);

    const addQuoteEntry = () =>
        setQuoteEntries([...quoteEntries, {
            id: quoteEntries.reduce((a, b) => a.id > b.id ? a : b).id + 1,
            body: "",
            speaker: "",
        }]);

    const deleteQuoteEntry = (quote: QuoteEntry) =>
        setQuoteEntries(
            quoteEntries
                .filter(q => q.id !== quote.id)
        );

    const changeQuoteText = (id: number, quote: string) =>
        setQuoteEntries(
            quoteEntries.map(q => ({
                ...q,
                body: q.id === id ? quote : q.body
            }))
        )

    const changeQuoteUsername = (id: number, username: string) =>
        setQuoteEntries(
            quoteEntries.map(q => ({
                ...q,
                speaker: q.id === id ? username : q.speaker
            }))
        );

    const extractUsername = (q: QuoteEntry) => {
        if (/^[a-zA-Z0-9]{2,32}$/.test(q.speaker)) {
            return q.speaker;
        } else if (/^.+\([a-zA-Z0-9]{2,32}\)$/.test(q.speaker)) {
            return q.speaker.split(/\(|\)/)[1];
        } else {
            return "NONE!";
        }
    }

    const canSubmit = () => quoteEntries.every(q => q.body.length > 0 && userList.map(u => u.uid.toLocaleLowerCase()).includes(extractUsername(q)));

    const submit = () => {
        apiPost("/api/quote", {
            shards: quoteEntries.map(s => ({
                body: s.body,
                speaker: extractUsername(s),
            }))
        })
            .then(() => {
                toast.success("Submitted Quote!", { theme: "colored" });
                setQuoteEntries([
                    {
                        id: 0,
                        body: "",
                        speaker: "",
                    }
                ]);
            })
            .catch(e => console.warn(e))
    }

    return (
        <Card>
            <CardBody>
                <ReactSortable list={quoteEntries} setList={setQuoteEntries} handle=".grab-drag" >
                    {quoteEntries.map((q, i) =>
                        <div key={i} className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faBars} className="fa-lg mr-4 grab-drag" />
                            <Input
                                className="mr-3"
                                type="text"
                                placeholder="Quote"
                                value={q.body}
                                onChange={e => changeQuoteText(q.id, e.target.value)}
                            />
                            <UserPicker value={q.speaker} onChange={e => changeQuoteUsername(q.id, e)} userList={userList} />
                            <Button className="shadow-none" onClick={() => deleteQuoteEntry(q)} disabled={quoteEntries.length <= 1}>
                                <FontAwesomeIcon
                                    icon={faCircleMinus}
                                    className={`${quoteEntries.length > 1 && "text-danger"} flex-grow-1`}
                                />
                            </Button>
                        </div>
                    )}
                </ReactSortable>
                {quoteEntries.length < 6 &&
                    <Button className="float-right my-2 shadow-none text-success" onClick={addQuoteEntry}>
                        <FontAwesomeIcon icon={faCirclePlus} />
                    </Button>
                }
                <Container className="d-flex px-0 pt-3">
                    <Button disabled={!canSubmit()} onClick={submit} size="sm" color="primary" className="flex-grow-1">Submit</Button>
                </Container>
            </CardBody>
        </Card >
    )
}

export default SubmitQuote;
