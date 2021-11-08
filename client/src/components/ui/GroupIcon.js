import styled from 'styled-components';

const StyledGroupIcon = styled("div")`
    width: 40px;
    height: 40px;
    box-shadow: 0px 4px 4px rgba(88, 88, 88, 0.25);
    border-radius: 50%;

    color: #FDFDFD;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;    

    background: ${props => props.color};
`;

export default function GroupIcon({group}) {
  const shortenName = group.groupName.substr(0, 2).toUpperCase();

  return (
    <StyledGroupIcon color={group.color || '#79ACBC'}>{shortenName}</StyledGroupIcon>)
  ;
}