CREATE PROCEDURE [dbo].[load_employees] 
   @user_id int
AS
BEGIN
SET NOCOUNT ON

delete from temp_users where id_no is null and last_name is null
insert into users (	
	id_no,
	last_name,
	first_name,
	middle_name,
	name_suffix,
	contact_nos,
	gender,
	civil_status,
	position_id,
	organization_id,
	rank_id,
	email_add,
	is_employee,
	created_by,
	created_date) 
  select
    id_no,
	last_name,
	first_name,
	middle_name,
	name_suffix,
	contact_nos,
	gender,
	civil_status,
	iif(isnull(position,'')='',NULL,dbo.getPositionIdByDesc(position)) position,
	dbo.getOrganizationIdByName(organization) organization,
	iif(isnull(rank,'')='',NULL,dbo.getRankIdByDesc(rank)) rank,
	email_add,	
	'Y' as is_emp,
	user_id,
	GETDATE()
	FROM temp_users
	WHERE user_id = @user_id
	order by id

	delete from temp_users WHERE user_id=@user_id

END;	




