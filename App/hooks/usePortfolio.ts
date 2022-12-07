import { useAppSelector } from '../redux/hooks';
import { selectPortfolioList } from '../redux/portfolioSlice';

export default function usePortfolio() {
    const portfolioList = useAppSelector(selectPortfolioList);

    return { portfolioList };
}
