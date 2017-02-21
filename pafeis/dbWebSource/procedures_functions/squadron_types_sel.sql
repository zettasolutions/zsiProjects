

CREATE PROCEDURE [dbo].[squadron_types_sel]
(
    @is_active char(1)='Y'
)
AS

BEGIN
   SELECT * FROM dbo.squadron_types where is_active=@is_active;
END



