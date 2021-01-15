CREATE PROCEDURE [dbo].[positions_sel] 
(
	 @client_id int = 0
	,@user_id INT=NULL
)
as
	

begin
set nocount on
   DECLARE @stmt nvarchar(max)
   SET @stmt = CONCAT('select * from dbo.positions_',@client_id,' order by position_title')
   EXEC(@stmt);
end

--[dbo].[positions_sel] @client_id = 0