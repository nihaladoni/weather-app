const Slider = ({ num }) => {
  return (
    <div className="slider">
      <div className="slider__top">
        <label>0</label>
        <label>50</label>
        <label>100</label>
      </div>
      <div>
        <input
          type="range"
          min="0"
          value={num}
          onChange={() => {}}
          max="100"
          list="tickmarks"
        />
      </div>
      <div className="slider__bottom">%</div>
    </div>
  );
};

export default Slider;
