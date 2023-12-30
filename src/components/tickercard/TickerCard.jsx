import { useContext } from "react";
import AppContext from "../../context/AppContext";
import style from "./TickerCard.module.css";

const TickerCard = ({ data }) => {
	const {
		handler: { chartRouteHandler },
	} = useContext(AppContext);
	return (
		<div
			className={style.tickercard}
			onClick={() => chartRouteHandler(data)}
		>
			<div className={style.symbol}>
				<p className={style.symboltext}>{data["1. symbol"]}</p>
			</div>
			<div className={style.info}>
				<p className={style.nametext}>{data["2. name"]}</p>
				<p className={style.regiontext}>{data["4. region"]}</p>
				<p className={style.currencytext}>{data["8. currency"]}</p>
				<p className={style.typetext}>{data["3. type"]}</p>
				<div className={style.timediv}>
					<p className={style.timetext}>{data["7. timezone"]}</p>
					<p className={style.timetext}>
						Open: {data["5. marketOpen"]}
					</p>
					<p className={style.timetext}>
						Close: {data["6. marketClose"]}
					</p>
				</div>
			</div>
		</div>
	);
};

export default TickerCard;
