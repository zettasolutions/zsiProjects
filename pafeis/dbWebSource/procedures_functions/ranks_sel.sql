
CREATE PROCEDURE [dbo].[ranks_sel]
(
  @is_active char(1)='Y'
)
AS

BEGIN
  SELECT * FROM dbo.ranks WHERE is_active=@is_active;
END

