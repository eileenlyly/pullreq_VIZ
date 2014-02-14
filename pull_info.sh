#!/bin/bash

if [ -z $1 ] || [ -z $2 ]; then
    echo "usage: pull_info repo_id repo_name"
    exit 1
fi

MYSQL="mysql -s -u msr14 -D msr14 -p"" -h localhost"


echo "repo_id: $1 , repo_name: $2 "

pull_commits="$2_pull_commits"

#insert project dummy user id = 999999
#this is required to create a dummy row in pull_requests table 
#in which it will connect with pull_request_commits
echo "insert into users (id) Values (999999);"|$MYSQL

#update pull_requests table with dummy pull_request that represent project_commits pull request
#there are foreign key requirement, hence I set base_commit_id = 566680, it could be any other value
echo "insert into pull_requests (base_repo_id, base_commit_id, user_id, pullreq_id) 
Values ($1, 566680,999999, 999999)" |$MYSQL

#create pull_request_commits table including project commits
echo "create table if not exists $2_commits
( pull_request_id INT (11),
  commit_id INT(11)
)"|$MYSQL 


echo "insert into $2_commits 
select * from pull_request_commits
where exists 
(select pullreq_id from pull_requests 
where pull_requests.base_repo_id = 79163 
and pull_requests.pullreq_id = pull_request_commits.pull_request_id)
union all
select 999999 as pull_request_id, commit_id
from project_commits
where project_id = $1
;"|$MYSQL


#create the third table as described
#fields: PQID, UID, committer_id, base_repo_id, Year, Month, Day
echo "create table if not exists $2_all_commits
as
select $2_commits.pull_request_id as PQID, commits.author_id as UID, 
commits.committer_id, pull_requests.base_repo_id, 
extract(year from commits.created_at) "Year",
extract(month from commits.created_at) "Month",
extract(day from commits.created_at) "Day"

from commits, $2_commits, pull_requests

where commits.id = $2_commits.commit_id 
and $2_commits.pull_request_id = pull_requests.pullreq_id
and pull_requests.base_repo_id =  $1"|$MYSQL

#insert in field CMT_AMT, UNM, CAT
echo "alter table $2_all_commits add CMT_AMT INT(11) NOT NULL Default 1; " |$MYSQL

echo "alter table $2_all_commits add CAT VARCHAR(11) NOT NULL Default \"O\";" |$MYSQL

echo "update $2_all_commits set CAT=\"I\" where $2_all_commits.PQID != 999999;"|$MYSQL

echo "create table $2_au_all
as
select   $2_all_commits.*, (users.name) as UNM
from 
         $2_all_commits, users
where    $2_all_commits.UID = users.id" |$MYSQL 

 
#create pull_request commit table
#echo "drop table $pull_commits;"|$MYSQL
#echo "create table $pull_commits as (select pull_requests.*, pull_request_commits.* from msr14.pull_requests, msr14.pull_request_commits 
#where  pull_requests.pullreq_id = pull_request_commits.pull_request_id and pull_requests.base_repo_id = $1 
#order by pull_requests.pullreq_id ASC);"|$MYSQL 
