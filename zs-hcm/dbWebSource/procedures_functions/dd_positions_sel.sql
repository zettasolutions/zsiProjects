CREATE PROCEDURE [dbo].[dd_positions_sel] 
(
	@client_id int
   ,@user_id INT = NULL
)
as
	

begin
   DECLARE @stmt NVARCHAR(MAX);
   SET @stmt = CONCAT('select * from dbo.positions_',@client_id,' order by position_title');
   EXEC(@stmt);
end

