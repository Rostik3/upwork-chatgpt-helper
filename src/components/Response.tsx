interface ResponseProps {
  text: string;
}

const Response = ({ text }: ResponseProps) => {
  return <p className="whitespace-pre-line text-white">{text}</p>;
};

export default Response;
