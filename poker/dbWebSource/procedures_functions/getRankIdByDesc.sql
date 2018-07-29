CREATE FUNCTION [dbo].[getRankIdByDesc](
@rank nvarchar(max)
) 
RETURNS int
AS
BEGIN
   DECLARE @l_retval int; 
      SELECT @l_retval = rank_id FROM dbo.ranks where rank_desc = @rank
      RETURN @l_retval;
END;

