import React from 'react'
import { Header, Segment,Icon,Input } from 'semantic-ui-react'
import HeaderSubHeader from 'semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader'
export default function MyHeader({channelName,numberOfUser,handleSearchChange,searchLoading,isprivatechannel,handleStar,isChannelStared,user }) {
    return (
        <Segment clearing>
            {/* Header Title */}
            <Header fluid="true" as="h2" floated="left" style={{marginBottom:0}}>
                <span>
                    {channelName}
                    {
                        !isprivatechannel && 
                        <Icon 
                            onClick={handleStar} 
                            name={isChannelStared?"star":"star outline" }
                            color={isChannelStared?"yellow":"black"}
                        />
                    }
                </span>
                <HeaderSubHeader>
                    {numberOfUser}
                </HeaderSubHeader>
            </Header>
            {/* Header Search */}
            <Header floated="right">
                <Input 
                    size="mini"
                    icon="search"
                    name="searchTerm"
                    placeholder="Search Messages"
                    onChange={handleSearchChange}
                    loading={searchLoading}
                />
            </Header>
        </Segment>
    )
}
