const CardText = ({ head, bodyData, body, foot = null }) => {
  return (
    <div className="card">
      <div className="card__head">
        <p>{head}</p>
      </div>
      <div className="card__body">
        <h1>
          <span>{bodyData}</span>
        </h1>
        <p>{body}</p>
      </div>
      <div className="card__footer">
        <div>{foot} </div>
      </div>
    </div>
  );
};

export default CardText;
