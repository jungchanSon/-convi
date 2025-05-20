import {CopyBlock, dracula} from "react-code-blocks";

const Custom1 = () => {

    const code = `docker build -t registry.example.com/review-buddy:1.0.0 .
docker push registry.example.com/review-buddy:1.0.0`

    return (
        <CopyBlock showLineNumbers={true} theme={dracula} text={code} language={'shell'}/>
    )
}

export default Custom1