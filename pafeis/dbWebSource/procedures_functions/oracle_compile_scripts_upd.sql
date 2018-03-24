CREATE PROCEDURE [dbo].[oracle_compile_scripts_upd](
@developer	VARCHAR(10)
,@source	VARCHAR(max)
,@server_user	VARCHAR(50)
,@file_type		VARCHAR(3)
,@user_id int

)
AS
BEGIN
    SET NOCOUNT ON
    declare @countrec int
    select @countrec=count(*) from dbo.oracle_compile_scripts where developer=@developer
    if(@countrec>0)
        update dbo.oracle_compile_scripts
        set developer = @developer
        ,[source] = @source
        ,server_user = @server_user
		,file_type = @file_type
        where developer=@developer
    else
        INSERT INTO oracle_compile_scripts(developer,source,server_user,file_type) values(@developer,@source,@server_user,@file_type)
END

