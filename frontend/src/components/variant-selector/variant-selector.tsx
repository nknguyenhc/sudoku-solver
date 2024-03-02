import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Dict = {
  [key: string]: string,
}

const VariantSelector = (): JSX.Element => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const url = useLocation().pathname;
  const urlToNameMap = useMemo<Dict>(() => ({
    '/': 'Normal',
    '/normal': 'Normal',
    '/killer': 'Killer',
  }), []);
  const nameToUrlMap = useMemo<Dict>(() => ({
    'Normal': '/normal',
    'Killer': '/killer',
  }), []);
  const navigate = useNavigate();

  const handleClick = useCallback((url: string) => {
    return () => {
      navigate(url);
      setIsHovering(false);
    };
  }, [navigate]);

  return (
    <div className="variant-selector">
      <div>Variant:</div>
      <div onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        <div className="variant-selector-highlight">{urlToNameMap[url]}</div>
        <div className="variant-selector-dropdown" style={{ display: isHovering ? 'block' : 'none' }}>
          <div className="variant-selector-dropdown-list">
            {Object.entries(nameToUrlMap).map(([name, url]) => (
              <div className="variant-selector-dropdown-list-item" onClick={handleClick(url)} key={name}>{name}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantSelector;
