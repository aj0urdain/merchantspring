import React from "react";
import { US, GB, AU } from "country-flag-icons/react/3x2";

interface FlagIconProps {
  countryCode3: string;
}

const FlagIcon: React.FC<FlagIconProps> = ({ countryCode3 }) => {
  switch (countryCode3) {
    case "USA":
      return <US title="United States" />;
    case "GBR":
      return <GB title="United Kingdom" />;
    case "AUS":
      return <AU title="Australia" />;
    default:
      return <></>; // Or render a default flag
  }
};

export default FlagIcon;
