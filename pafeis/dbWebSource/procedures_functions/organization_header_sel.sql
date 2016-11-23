
CREATE PROCEDURE [dbo].[organization_header_sel] 
(
    @level_no  INT = 1
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
DECLARE @ctr int = 0
DECLARE @rec int = 0
DECLARE @organization VARCHAR(20)
DECLARE @clevel_no int = 0
DECLARE @tt AS TABLE (
    level_no int
   ,organization VARCHAR(20)
)



  SET @stmt = 'SELECT '''' organization_id, '''' organization_type_id, '''' organization_pid, '''' level_no, organization_type_code + '' CODE'' organization_code, organization_type_code +'' NAME'' organization_name, 
         organization_type_code + '' COMMANDER'' organization_head_id, organization_type_code + '' LOCATION'' organization_address ' 

  INSERT INTO @tt SELECT level_no, organization_type_name FROM organization_types WHERE level_no > @level_no order by level_no
  SELECT @rec = COUNT(*) FROM @tt 
   WHILE @ctr < @rec 
   BEGIN	
        SET @stmt = @stmt + ',''# OF ' + dbo.getSubOrganizationType(cast(IIF(@clevel_no=0,@level_no,@clevel_no) as varchar(20))) + ''''
		SELECT TOP 1 @organization = organization, @clevel_no = level_no FROM @tt WHERE level_no > @clevel_no
		SET @stmt = @stmt + ' AS subOrganization' + cast(@clevel_no as varchar(20))
        SET @ctr = @ctr + 1
   END	
   SET @stmt = @stmt + ', '' ACTIVE? '' is_active FROM dbo.organization_types WHERE level_no=' + cast(@level_no as varchar(20))
   exec(@stmt);
END
